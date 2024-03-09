'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Chat() {

  const { push } = useRouter();

  useEffect(() => {
    push('/classify');
  }, []);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">

    </div>
  );
}
