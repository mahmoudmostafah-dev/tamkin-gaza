export enum OTPTypeEnum {
    CONFIRM_EMAIL = "Confirm Email",
    ENABLE_2FA = "Enable 2FA",
    DISABLE_2FA = "Disable 2FA",
    LOGIN_OTP = "Login OTP",
    UPDATE_EMAIL = "Update Email",
    RESET_PASSWORD = "Reset Password",
}


export enum E_OTPStatus {
    ACTIVE = "active",
    USED = "used",
    EXPIRED = "expired",
    BLOCKED = "blocked"
}