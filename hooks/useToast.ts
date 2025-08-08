import React from 'react';
import { 
  useToast as useGluestackToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from '@/components/ui/toast';

export const useAppToast = () => {
  const toast = useGluestackToast();

  const showSuccess = (title: string, description?: string) => {
    toast.show({
      id: Math.random().toString(),
      placement: 'top right',
      duration: 3000,
      render: ({ id }) => {
        return React.createElement(
          Toast,
          { nativeID: `toast-${id}`, action: 'success', variant: 'solid' },
          React.createElement(ToastTitle, null, title),
          description && React.createElement(ToastDescription, null, description)
        );
      },
    });
  };

  const showError = (title: string, description?: string) => {
    toast.show({
      id: Math.random().toString(),
      placement: 'top right',
      duration: 4000,
      render: ({ id }) => {
        return React.createElement(
          Toast,
          { nativeID: `toast-${id}`, action: 'error', variant: 'solid' },
          React.createElement(ToastTitle, null, title),
          description && React.createElement(ToastDescription, null, description)
        );
      },
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast.show({
      id: Math.random().toString(),
      placement: 'top right',
      duration: 3000,
      render: ({ id }) => {
        return React.createElement(
          Toast,
          { nativeID: `toast-${id}`, action: 'info', variant: 'solid' },
          React.createElement(ToastTitle, null, title),
          description && React.createElement(ToastDescription, null, description)
        );
      },
    });
  };

  const showWarning = (title: string, description?: string) => {
    toast.show({
      id: Math.random().toString(),
      placement: 'top right',
      duration: 3500,
      render: ({ id }) => {
        return React.createElement(
          Toast,
          { nativeID: `toast-${id}`, action: 'warning', variant: 'solid' },
          React.createElement(ToastTitle, null, title),
          description && React.createElement(ToastDescription, null, description)
        );
      },
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    toast,
  };
};

// Re-export the components for convenience
export {
  Toast,
  ToastTitle,
  ToastDescription,
};
