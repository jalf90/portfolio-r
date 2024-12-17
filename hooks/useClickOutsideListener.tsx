import { useEffect } from 'react';

export default function useOutsideAlerter(ref: React.RefObject<any>, elementToHideRef: React.RefObject<any>) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        elementToHideRef.current &&
        !ref.current.contains(event.target) &&
        !elementToHideRef.current.classList.contains('hidden')
      ) {
        elementToHideRef.current.classList.add('hidden');
      } else if (
        elementToHideRef.current &&
        ref.current.contains(event.target) &&
        elementToHideRef.current.classList.contains('hidden')
      ) {
        elementToHideRef.current.classList.remove('hidden');
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
