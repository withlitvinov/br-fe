export enum SubmitStatus {
  Ok,
  Fail,
}

export type PostSubmitFn = (submitStatus: SubmitStatus) => void;

export type BaseFormProps<FormState, SubmitPayload = FormState> = {
  onSubmit: (payload: SubmitPayload, postSubmitFn: PostSubmitFn) => void;
};
