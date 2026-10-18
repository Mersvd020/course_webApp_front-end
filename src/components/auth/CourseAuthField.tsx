'use client';

import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function CourseAuthField({ name, label, type = 'text', errors, autoComplete, inputMode, defaultValue, required = true }: {
  name: string; label: string; type?: 'text' | 'email' | 'tel' | 'password'; errors?: string[];
  autoComplete?: string; inputMode?: 'numeric' | 'email' | 'tel'; defaultValue?: string; required?: boolean;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return <div className="course-auth-field"><label htmlFor={id}>{label}</label><div className="course-auth-input"><input id={id} name={name} type={type === 'password' && visible ? 'text' : type} autoComplete={autoComplete} inputMode={inputMode} defaultValue={defaultValue} required={required} aria-invalid={Boolean(errors?.length)} aria-describedby={errors?.length ? `${id}-error` : undefined} dir="ltr" />{type === 'password' && <button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>}</div>{errors?.length ? <p id={`${id}-error`} className="auth-field-error">{errors.join(' ')}</p> : null}</div>;
}
