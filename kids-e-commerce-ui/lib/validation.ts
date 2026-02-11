'use client'

export interface FormErrors {
  [key: string]: string
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  // At least 6 characters
  return password.length >= 6
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic validation for international format
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/
  return phoneRegex.test(phone)
}

export function validateLoginForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {}

  if (!email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  return errors
}

export function validateRegisterForm(
  email: string,
  password: string,
  confirmPassword: string,
  username: string,
  fullName: string
): FormErrors {
  const errors: FormErrors = {}

  if (!email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!username) {
    errors.username = 'Username is required'
  } else if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
  }

  if (!fullName) {
    errors.fullName = 'Full name is required'
  } else if (fullName.length < 3) {
    errors.fullName = 'Full name must be at least 3 characters'
  }

  return errors
}

export function validateCheckoutForm(
  fullName: string,
  email: string,
  phoneNumber: string,
  address: string
): FormErrors {
  const errors: FormErrors = {}

  if (!fullName) {
    errors.fullName = 'Full name is required'
  } else if (fullName.length < 3) {
    errors.fullName = 'Full name must be at least 3 characters'
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!phoneNumber) {
    errors.phoneNumber = 'Phone number is required'
  } else if (!validatePhoneNumber(phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number'
  }

  if (!address) {
    errors.address = 'Address is required'
  } else if (address.length < 5) {
    errors.address = 'Please enter a complete address'
  }

  return errors
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0
}
