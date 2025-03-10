export interface SubmitQuizDto {
  customerId: number;
  answers: { questionId: number; answerId: number }[]; // Xóa null, vì mình chắc chắn gửi lên sẽ có answerId
}
