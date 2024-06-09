export enum SubmitStatus {
  Ok,
  Fail,
}

export type PostSubmitFn = (submitStatus: SubmitStatus) => void;

export type BaseFormProps<FormState> = {
  onSubmit: (data: FormState, postSubmitFn: PostSubmitFn) => void;
};
