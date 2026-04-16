'use server';

import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
  message?: string;
};

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Basic validation
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }

  if (!password || password.trim() === '') {
    throw new Error('Password is required');
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    // NextAuth throws a redirect error when redirect is false
    // Check if it's a credentials error
    const errorMessage = error instanceof Error ? error.message : '';

    if (errorMessage.includes('CredentialsSignin')) {
      throw new Error('Invalid email or password');
    }

    throw new Error('An unexpected error occurred. Please try again.');
  }

  redirect('/admin');
}
