import {
  TextInput as BaseTextInput,
  TextInputProps as BaseTextInputProps,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";

interface ITextInputProps extends BaseTextInputProps {
  wrapperProps?: ViewProps;
  preIcon?: React.ReactNode;
  postIcon?: React.ReactNode;
  error?: string;
}

export function TextInput(props: ITextInputProps) {
  const { style, wrapperProps, preIcon, postIcon, error, ...rest } = props;

  const { style: wrapperStyle, ...restWrapperProps } = wrapperProps || {};

  return (
    <>
      <View {...restWrapperProps} style={[styles.wrapper, wrapperStyle]}>
        {preIcon}
        <BaseTextInput {...rest} style={[styles.textInput, style]} />
        {postIcon}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    borderRadius: 12,
    paddingHorizontal: 16,
    height: 40,

    backgroundColor: "rgba(240, 240, 240, 1)",
  },
  textInput: {
    flex: 1,

    fontSize: 14,
    fontWeight: "400",
  },
  error: {
    fontSize: 12,
    fontWeight: "400",
    color: "#e54646",
  },
});
