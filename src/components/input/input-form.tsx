import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  Grid,
  Theme,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useForm, Controller } from "react-hook-form";
import { PropertyList } from "@components/property-list";
import { PropertyListItem } from "@components/property-list-item";
import numeral from "numeral";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface receipt {
  memo: string;
  price: number;
}

export const InputForm = () => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";
  const [total, setTotal] = useState<number | undefined>(0);
  const [confirmTotal, setConFirmTotal] = useState<{
    memo: string;
    price: number;
  }>();

  const [money, setMoney] = useState<number | undefined>(0);
  const [confirmMoney, setConFirmMoney] = useState<{
    memo: string;
    price: number;
  }>();

  const [withdraw, setWithdraw] = useState<number | undefined>(0);
  const [withdRowMemo, setWithdRowMemo] = useState<string>("");
  const [deposit, setDeposit] = useState<number | undefined>(0);
  const [depositMemo, setDepositMemo] = useState<string>("");

  const [receipt, setReceipt] = useState<receipt[]>([]);

  const inputTotal = (price?: number) => {
    if (price === undefined) return;
    setConFirmTotal({ memo: "렉스 입출손익", price });
    setTotal(0);
  };
  const inputMoney = (price?: number) => {
    if (price === undefined) return;
    setConFirmMoney({ memo: "현 잔고", price });
    setMoney(0);
  };
  const inputButton = (type: string) => {
    if (type === "withdraw") {
      if (!withdraw || !withdRowMemo) return;
      setReceipt([...receipt, { memo: withdRowMemo, price: withdraw * -1 }]);
      setWithdRowMemo("");
      setWithdraw(0);
    }
    if (type === "deposit") {
      if (!deposit || !depositMemo) return;
      setReceipt([...receipt, { memo: depositMemo, price: deposit }]);
      setDepositMemo("");
      setDeposit(0);
    }
  };
  const removeItemAtIndex = (index: number) => {
    setReceipt((currentReceipt) => {
      return currentReceipt.filter((item, idx) => idx !== index);
    });
  };

  // const yesterdayTotal = 23220000;
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const totalWithdraw = receipt.reduce((total, item) => {
    return total + item.price;
  }, 0); // 초기값 0으로 시작

  return (
    <Box sx={{ display: "flex", width: "100%", mt: 5 }}>
      <Grid container>
        <Grid item md={6} xs={12}>
          <PropertyList>
            <PropertyListItem align={align} label="·어제 잔고">
              <Box display={"flex"}>
                <NumericFormat
                  customInput={TextField}
                  thousandSeparator={true}
                  variant="outlined"
                  fullWidth
                  value={yesterdayTotal}
                  onValueChange={(v) => {
                    setYesterdayTotal(v.floatValue ? v.floatValue : 0);
                  }}
                  InputLabelProps={{ style: { fontSize: "small" } }}
                  inputProps={{
                    maxLength: 15,
                    style: { fontSize: "small", textAlign: "right" },
                  }}
                  size={"small"}
                />
              </Box>
            </PropertyListItem>
            <PropertyListItem align={align} label="·현 잔고">
              <Box display={"flex"}>
                <NumericFormat
                  customInput={TextField}
                  thousandSeparator={true}
                  variant="outlined"
                  fullWidth
                  value={money}
                  onValueChange={(v) => {
                    setMoney(v.floatValue);
                  }}
                  InputLabelProps={{ style: { fontSize: "small" } }}
                  inputProps={{
                    maxLength: 15,
                    style: { fontSize: "small", textAlign: "right" },
                  }}
                  size={"small"}
                />

                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => inputMoney(money)}
                >
                  <Typography fontSize={"small"} fontWeight={"bold"}>
                    입력
                  </Typography>
                </Button>
              </Box>
              <Typography fontSize={"small"}>
                ※ 가상, 뒷장 잔고 총 합
              </Typography>
            </PropertyListItem>
            <PropertyListItem align={align} label="·렉스 입출손익">
              <Box display={"flex"}>
                <NumericFormat
                  customInput={TextField}
                  thousandSeparator={true}
                  variant="outlined"
                  fullWidth
                  value={total}
                  onValueChange={(v) => {
                    setTotal(v.floatValue);
                  }}
                  InputLabelProps={{ style: { fontSize: "small" } }}
                  inputProps={{
                    maxLength: 15,
                    style: { fontSize: "small", textAlign: "right" },
                  }}
                  size={"small"}
                />

                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => inputTotal(total)}
                >
                  <Typography fontSize={"small"} fontWeight={"bold"}>
                    입력
                  </Typography>
                </Button>
              </Box>
              <Typography fontSize={"small"}>
                ※ 솔루션상 당일 입출 손익, - 인 경우 - 입력후 금액입력
              </Typography>
            </PropertyListItem>
            <PropertyListItem align={align} label="·지출내역">
              <Box display={"flex"}>
                <TextField
                  fullWidth
                  value={withdRowMemo}
                  label="내역"
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ style: { fontSize: "small" } }}
                  inputProps={{
                    style: { fontSize: "small" },
                  }}
                  onChange={(e) => setWithdRowMemo(e.target.value)}
                />
                <NumericFormat
                  customInput={TextField}
                  thousandSeparator={true}
                  variant="outlined"
                  fullWidth
                  value={withdraw}
                  onValueChange={(v) => {
                    setWithdraw(v.floatValue);
                  }}
                  InputLabelProps={{ style: { fontSize: "small" } }}
                  inputProps={{
                    maxLength: 15,
                    style: { fontSize: "small", textAlign: "right" },
                  }}
                  size={"small"}
                />

                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => inputButton("withdraw")}
                >
                  <Typography fontSize={"small"} fontWeight={"bold"}>
                    입력
                  </Typography>
                </Button>
              </Box>
              <Typography fontSize={"small"}>※ 내역 반드시 입력</Typography>
              <Typography fontSize={"small"}>
                예)다올 출금 수수료, 다올 입금 수수료, 은행 이체수수료, 장값,
                선불폰 등등
              </Typography>
            </PropertyListItem>
            <PropertyListItem align={align} label="·입금내역">
              <Box display={"flex"}>
                <TextField
                  fullWidth
                  value={depositMemo}
                  label="메모"
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ style: { fontSize: "small" } }}
                  inputProps={{
                    style: { fontSize: "small" },
                  }}
                  onChange={(e) => setDepositMemo(e.target.value)}
                />
                <NumericFormat
                  customInput={TextField}
                  thousandSeparator={true}
                  variant="outlined"
                  fullWidth
                  value={deposit}
                  onValueChange={(v) => {
                    setDeposit(v.floatValue);
                  }}
                  InputLabelProps={{ style: { fontSize: "small" } }}
                  inputProps={{
                    maxLength: 15,
                    style: { fontSize: "small", textAlign: "right" },
                  }}
                  size={"small"}
                />

                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => inputButton("deposit")}
                >
                  <Typography fontSize={"small"} fontWeight={"bold"}>
                    입력
                  </Typography>
                </Button>
              </Box>
              <Typography fontSize={"small"}>※ 내역 반드시 입력</Typography>
            </PropertyListItem>
          </PropertyList>
        </Grid>
        <Grid item md={6} xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width={"50%"} sx={{ backgroundColor: "#f5f5f5" }}>
                    <Typography
                      fontSize={"small"}
                      color={"primary"}
                      fontWeight={"bold"}
                    >
                      전일 잔고
                    </Typography>
                  </TableCell>
                  <TableCell
                    width={"50%"}
                    sx={{ backgroundColor: "#f5f5f5" }}
                    align="right"
                  >
                    <Typography
                      fontSize={"small"}
                      color={"primary"}
                      fontWeight={"bold"}
                    >
                      {numeral(yesterdayTotal).format(`0,0`)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography
                      fontSize={"small"}
                      color={"error"}
                      fontWeight={"bold"}
                    >
                      현 잔고
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      display={"flex"}
                      justifyContent={"end"}
                      alignItems={"center"}
                    >
                      <Typography
                        fontSize={"small"}
                        fontWeight={"bold"}
                        color={
                          confirmMoney?.price && confirmMoney?.price < 0
                            ? "error"
                            : ""
                        }
                      >
                        {numeral(confirmMoney?.price).format(`0,0`)}
                      </Typography>
                      {confirmMoney?.memo && (
                        <Button
                          color="error"
                          onClick={() =>
                            setConFirmMoney({ memo: "", price: 0 })
                          }
                        >
                          삭제
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography fontSize={"small"} fontWeight={"bold"}>
                      입출손익
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      display={"flex"}
                      justifyContent={"end"}
                      alignItems={"center"}
                    >
                      <Typography
                        fontSize={"small"}
                        fontWeight={"bold"}
                        color={
                          confirmTotal?.price && confirmTotal?.price < 0
                            ? "error"
                            : ""
                        }
                      >
                        {numeral(confirmTotal?.price).format(`0,0`)}
                      </Typography>
                      {confirmTotal?.memo && (
                        <Button
                          color="error"
                          onClick={() =>
                            setConFirmTotal({ memo: "", price: 0 })
                          }
                        >
                          삭제
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>

                {receipt.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography
                          fontSize={"small"}
                          color={item.price < 0 ? "error" : ""}
                          fontWeight={"bold"}
                        >
                          {index + 1}. {item.memo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"flex-end"}
                        >
                          <Typography
                            color={item.price < 0 ? "error" : ""}
                            fontWeight={"bold"}
                            fontSize={"small"}
                          >
                            {numeral(item?.price).format(`0,0`)}
                          </Typography>
                          <Button
                            color="error"
                            onClick={() => {
                              removeItemAtIndex(index);
                            }}
                          >
                            삭제
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={"bold"}>오차</Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"flex-end"}
                    >
                      <Typography
                        fontWeight={"bold"}
                        color={
                          confirmMoney?.memo &&
                          confirmTotal?.memo &&
                          (yesterdayTotal -
                            confirmMoney.price +
                            confirmTotal?.price +
                            totalWithdraw) *
                            -1 <
                            0
                            ? "error"
                            : ""
                        }
                      >
                        {numeral(
                          confirmTotal?.memo && confirmMoney?.memo
                            ? (yesterdayTotal -
                                confirmMoney.price +
                                confirmTotal?.price +
                                totalWithdraw) *
                                -1
                            : 0
                        ).format(`0,0`)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography fontSize={"small"} align="right" sx={{ m: 1 }}>
            ※ 금액이 - 인 경우 정산금액보다 부족함
          </Typography>
          <Button fullWidth variant="contained">
            <Typography fontSize={"small"} fontWeight={"bold"}>
              정산완료
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
