import { SetStateAction } from 'react';

export type SetState<T> = (value: SetStateAction<T>) => void;
