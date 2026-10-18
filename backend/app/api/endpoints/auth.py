from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    verify_password, hash_password, create_access_token,
    create_refresh_token, decode_token, hash_token
)
from app.core.deps import get_current_user, get_current_active_user
from app.models.user import User, UserPreferences, RefreshToken
from app.schemas.user import (
    LoginRequest, TokenResponse, RefreshTokenRequest, UserCreate,
    UserResponse, UserDetailResponse, UserUpdate, PasswordChangeRequest,
    UserPreferencesUpdate, UserPreferencesResponse
)
from app.schemas.common import ResponseEnvelope

router = APIRouter()

@router.post("/login", response_model=ResponseEnvelope[TokenResponse])
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email and password, returning access and refresh tokens."""
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")
        
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token(user.id, user.role)
    raw_refresh_token = create_refresh_token(user.id)

    # Store hashed refresh token in database
    hashed_rf = hash_token(raw_refresh_token)
    rf_payload = decode_token(raw_refresh_token)
    expires_at = datetime.fromtimestamp(rf_payload["exp"], tz=timezone.utc)
    
    db_rf = RefreshToken(
        user_id=user.id,
        token_hash=hashed_rf,
        expires_at=expires_at
    )
    db.add(db_rf)
    db.commit()

    token_data = TokenResponse(
        access_token=access_token,
        refresh_token=raw_refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )
    return ResponseEnvelope(data=token_data, message="Login successful")

@router.post("/register", response_model=ResponseEnvelope[TokenResponse])
def register(request: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered")

    user = User(
        name=request.name,
        email=request.email,
        password_hash=hash_password(request.password),
        role="user",  # Default new registrations to regular user
        profile_pic=request.profile_pic,
        timezone=request.timezone or "UTC"
    )
    db.add(user)
    db.flush()

    # Create default user preferences
    prefs = UserPreferences(user_id=user.id)
    db.add(prefs)

    access_token = create_access_token(user.id, user.role)
    raw_refresh_token = create_refresh_token(user.id)

    hashed_rf = hash_token(raw_refresh_token)
    rf_payload = decode_token(raw_refresh_token)
    expires_at = datetime.fromtimestamp(rf_payload["exp"], tz=timezone.utc)
    
    db_rf = RefreshToken(
        user_id=user.id,
        token_hash=hashed_rf,
        expires_at=expires_at
    )
    db.add(db_rf)
    db.commit()
    db.refresh(user)

    token_data = TokenResponse(
        access_token=access_token,
        refresh_token=raw_refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )
    return ResponseEnvelope(data=token_data, message="Registration successful")

@router.post("/refresh", response_model=ResponseEnvelope[TokenResponse])
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Rotates refresh token and returns new access & refresh token pair."""
    payload = decode_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    token_hash_val = hash_token(request.refresh_token)
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash_val,
        RefreshToken.is_revoked == False
    ).first()

    if not db_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked or not found")

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account inactive or missing")

    # Revoke old refresh token (Token Rotation)
    db_token.is_revoked = True

    # Generate new token pair
    new_access_token = create_access_token(user.id, user.role)
    new_raw_refresh = create_refresh_token(user.id)
    new_hashed_rf = hash_token(new_raw_refresh)
    new_payload = decode_token(new_raw_refresh)
    new_expires_at = datetime.fromtimestamp(new_payload["exp"], tz=timezone.utc)

    db_new_rf = RefreshToken(
        user_id=user.id,
        token_hash=new_hashed_rf,
        expires_at=new_expires_at
    )
    db.add(db_new_rf)
    db.commit()

    token_data = TokenResponse(
        access_token=new_access_token,
        refresh_token=new_raw_refresh,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )
    return ResponseEnvelope(data=token_data, message="Token refreshed successfully")

@router.post("/logout", response_model=ResponseEnvelope[bool])
def logout(
    request: RefreshTokenRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Revokes the current refresh token."""
    token_hash_val = hash_token(request.refresh_token)
    db.query(RefreshToken).filter(
        RefreshToken.user_id == current_user.id,
        RefreshToken.token_hash == token_hash_val
    ).update({"is_revoked": True})
    db.commit()
    return ResponseEnvelope(data=True, message="Logged out successfully")

@router.get("/me", response_model=ResponseEnvelope[UserDetailResponse])
def get_current_user_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get authenticated user profile, preferences, and task statistics."""
    # Ensure preferences exist
    prefs = current_user.preferences
    if not prefs:
        prefs = UserPreferences(user_id=current_user.id)
        db.add(prefs)
        db.commit()
        db.refresh(current_user)

    detail = UserDetailResponse.model_validate(current_user)
    detail.preferences = UserPreferencesResponse.model_validate(prefs)
    detail.assigned_tasks_count = len(current_user.assigned_tasks)
    detail.created_tasks_count = len(current_user.created_tasks)
    return ResponseEnvelope(data=detail)

@router.put("/me", response_model=ResponseEnvelope[UserResponse])
def update_profile(
    profile_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update profile details of the current user."""
    if profile_in.name is not None:
        current_user.name = profile_in.name
    if profile_in.profile_pic is not None:
        current_user.profile_pic = profile_in.profile_pic
    if profile_in.timezone is not None:
        current_user.timezone = profile_in.timezone
    
    # Regular users cannot change their own role or active status
    if current_user.role == "admin":
        if profile_in.role is not None:
            current_user.role = profile_in.role
        if profile_in.is_active is not None:
            current_user.is_active = profile_in.is_active

    db.commit()
    db.refresh(current_user)
    return ResponseEnvelope(data=UserResponse.model_validate(current_user), message="Profile updated")

@router.put("/preferences", response_model=ResponseEnvelope[UserPreferencesResponse])
def update_preferences(
    prefs_in: UserPreferencesUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user UI/UX and notification preferences."""
    prefs = current_user.preferences
    if not prefs:
        prefs = UserPreferences(user_id=current_user.id)
        db.add(prefs)
        db.flush()

    data = prefs_in.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(prefs, field, val)

    db.commit()
    db.refresh(prefs)
    return ResponseEnvelope(data=UserPreferencesResponse.model_validate(prefs), message="Preferences updated")

@router.post("/change-password", response_model=ResponseEnvelope[bool])
def change_password(
    req: PasswordChangeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Change current user password."""
    if not verify_password(req.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password incorrect")

    current_user.password_hash = hash_password(req.new_password)
    # Revoke all active refresh tokens for security
    db.query(RefreshToken).filter(RefreshToken.user_id == current_user.id).update({"is_revoked": True})
    db.commit()
    return ResponseEnvelope(data=True, message="Password updated successfully")
