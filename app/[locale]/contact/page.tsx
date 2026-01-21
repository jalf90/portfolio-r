'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { MdContactMail, MdSend } from 'react-icons/md';
import styles from './styles.module.scss';
import { useState } from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { EMAIL_REGEX } from '@/app/constants/regex';
import CircularProgress from '@mui/material/CircularProgress';

const initialEmailFormData = {
  firstname: '',
  lastname: '',
  email: '',
  subject: 'Contact Form Submission from Portfolio app (React + Next.js)',
  message: '',
};

type ToastState = {
  open: boolean;
  severity: 'success' | 'error';
  message: string;
};

const initialToast: ToastState = {
  open: false,
  severity: 'success',
  message: '',
};

export default function ContactPage() {
  const tc = useTranslations('common');
  const tn = useTranslations('notifications');

  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<ToastState>(initialToast);

  const [emailFormData, setEmailFormData] = useState(initialEmailFormData);

  const handleToastClose = (_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  function onEmailFormDataChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEmailFormData({ ...emailFormData, [e.target.name]: e.target.value });
  }

  const validForm =
    !!emailFormData.firstname.trim().length &&
    !!emailFormData.lastname.trim().length &&
    !!emailFormData.email.length &&
    emailFormData.email.match(EMAIL_REGEX);

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSending(true);

    try {
      const payload = {
        ...emailFormData,
        firstname: emailFormData.firstname.trim(),
        lastname: emailFormData.lastname.trim(),
        email: emailFormData.email.trim(),
        message: emailFormData.message.trim(),
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      await response.json();

      if (response.ok) {
        setToast({
          open: true,
          severity: 'success',
          message: tn('emailSentSuccessfully'),
        });
        setEmailFormData(initialEmailFormData);
      } else {
        setToast({
          open: true,
          severity: 'error',
          message: tn('emailSentError'),
        });
      }
    } catch (error) {
      setToast({
        open: true,
        severity: 'error',
        message: tn('emailSentError'),
      });
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className={clsx('flex flex-column justify-content-center', styles.container)}>
      <h2 className="flex align-items-center">
        <MdContactMail className="mr-1" /> {tc('contact')}
      </h2>
      <form onSubmit={handleEmailSubmit} className="flex flex-column justify-content-center">
        <div className={styles.nameFields}>
          <div className="flex flex-column flex-full">
            <label htmlFor="firstname" className="mt-2">
              {tc('firstname')}
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={emailFormData.firstname}
              onChange={onEmailFormDataChange}
              placeholder={tc('forms.typeHereYour', { fieldName: tc('firstname').toLocaleLowerCase() })}
            />
          </div>
          <div className="flex flex-column flex-full">
            <label htmlFor="lastname" className="mt-2">
              {tc('lastname')}
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={emailFormData.lastname}
              onChange={onEmailFormDataChange}
              placeholder={tc('forms.typeHereYour', { fieldName: tc('lastname').toLocaleLowerCase() })}
            />
          </div>
        </div>
        <label htmlFor="email" className="mt-2">
          {tc('email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={emailFormData.email}
          onChange={onEmailFormDataChange}
          placeholder={tc('forms.typeHereYour', { fieldName: tc('email').toLocaleLowerCase() })}
        />
        <label htmlFor="message" className="mt-2">
          {tc('message')} <small>({tc('optional')})</small>
        </label>
        <textarea
          id="message"
          name="message"
          value={emailFormData.message}
          onChange={onEmailFormDataChange}
          placeholder={tc('forms.typeHereYour', { fieldName: tc('message').toLocaleLowerCase() })}
          rows={10}
        />
        <button type="submit" className="mt-2 primary" disabled={!validForm || isSending}>
          {isSending ? <CircularProgress size="15px" color="inherit" className="flex" /> : <MdSend />}
          {tc('sendMessage')}
        </button>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Snackbar
            open={toast.open}
            autoHideDuration={6000}
            onClose={handleToastClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleToastClose} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
              {toast.message}
            </Alert>
          </Snackbar>
        </Box>
      </form>
    </div>
  );
}
