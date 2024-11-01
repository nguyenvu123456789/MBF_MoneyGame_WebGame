export class IRequestPage{
  pageIndex = 0;
  pageSize = 10;
  filtering = {
    id : 0,
    msisdn : '',
    gameId : 0,
    prizeId : 0,
    startDate : null,
    endDate : null
};
  sorting = {
    direction: 0,
    field: "id"
};
  paginated = true
}
