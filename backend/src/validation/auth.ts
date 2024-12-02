interface ValidationResult {
  errors: Record<string, string>;
  isValid: boolean;
}

interface LoginInput {
  username: string;
  password: string;
}

export const validateLoginInput = (data: LoginInput): ValidationResult => {
  const errors: Record<string, string> = {};

  // Check username
  if (!data.username || data.username.trim().length === 0) {
    errors.username = 'Username is required';
  } else if (data.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }

  // Check password
  if (!data.password || data.password.trim().length === 0) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

interface RegisterInput extends LoginInput {
  confirmPassword?: string;
}

export const validateRegisterInput = (data: RegisterInput): ValidationResult => {
  const errors: Record<string, string> = {};

  // Check username
  if (!data.username || data.username.trim().length === 0) {
    errors.username = 'Username is required';
  } else if (data.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }

  // Check password
  if (!data.password || data.password.trim().length === 0) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  // Check confirm password
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
