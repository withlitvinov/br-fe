enum SubmitStatus {
  Ok,
  Fail,
}

type PostSubmitFn = (submitStatus: SubmitStatus) => void;

type BaseFormProps<FormState, SubmitPayload = FormState> = {
  onSubmit: (payload: SubmitPayload, postSubmitFn: PostSubmitFn) => void;
};

export type { PostSubmitFn, BaseFormProps };
export { SubmitStatus };
