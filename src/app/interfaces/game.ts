export interface IPrize {
  id: number;
  name: string;
  quantity: number;
  format: string,
  price: number,
  totalPrice: number,
  remainingPrice: number,
  image: string,
  colorCode: string,
  gameId: number,
  gameName: string
}

// GameResponse interface
export interface IGame {
  id: number;
  nameGame: string;
  backgroundImage: string;
  fontType: string;
  fontSize: number;
  borderColor: string;
  prizesPerDay: number;
  buttonColor: string;
  spinEndTime: string; // LocalTime có thể được trả về dưới dạng chuỗi "HH:mm:ss"
  spinStartTime: string; // LocalTime cũng sẽ ở định dạng chuỗi
  timeSpin: number;
  audioUrl: string;
  namePromotion: string;
  status: boolean;
  createdAt: string; // LocalDate có thể được trả về dưới dạng chuỗi "yyyy-MM-dd"
  startDate: string; // Tương tự cho LocalDate
  endDate: string; // Tương tự cho LocalDate
  disabled: boolean;
  prizes: IPrize[]; // Danh sách giải thưởng
}
