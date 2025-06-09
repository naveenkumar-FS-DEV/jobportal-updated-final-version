import * as Yup from 'yup';

export const jobseekerSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
  city: Yup.string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits')
    .required('Pincode is required'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const employerSchema = Yup.object().shape({
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
  companySize: Yup.string()
    .required('Company size is required'),
  city: Yup.string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits')
    .required('Pincode is required'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  productsAndServices: Yup.string(),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const jobPostSchema = Yup.object().shape({
  title: Yup.string()
    .required('Job title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: Yup.string()
    .required('Job description is required')
    .min(50, 'Description must be at least 50 characters'),
  requirements: Yup.string()
    .required('Job requirements are required')
    .min(30, 'Requirements must be at least 30 characters'),
  type: Yup.string()
    .required('Job type is required'),
  location: Yup.string()
    .required('Location is required'),
  salary: Yup.string()
    .optional(),
  experience: Yup.string()
    .required('Experience level is required'),
  deadline: Yup.date()
    .min(new Date(), 'Deadline must be in the future')
    .optional(),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});