import { BaseToast, ErrorToast, ToastProps } from "react-native-toast-message";

export const toastConfig = {
  info: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftWidth: 0, borderRadius: 10 }}
      text1Style={{ fontSize: 15, color: "#128085" }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftWidth: 0, borderRadius: 10 }}
      text1Style={{ fontSize: 15, color: "#e54646" }}
    />
  ),
};
