import { ChangeEvent, FC, Fragment, MouseEvent, useEffect } from "react";
import {
  Box,
  Button,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import numeral from "numeral";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { deposit, withdraw } from "@prisma/client";
import useMutation from "@libs/useMutation";
import Link from "next/link";

interface props {
  list: {
    id: number;
    totalAt: Date;
    createAt: Date;
    yesterDayTotal: number;
    todayTotal: number;
    solutionTotal: number;
    marginTotla: number;
    withdraw: withdraw[];
    deposit: deposit[];
    withdrawCount: number;
    withdrawTotal: number;
    depositCount: number;
    depositTotal: number;
    confirm: boolean;
  }[];
  mutate: () => void;
  listCount: number;
  onPageChange: (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  level: string;
}

export const List: FC<props> = (props) => {
  const {
    level,
    list,
    mutate,
    page,
    rowsPerPage,
    listCount,
    onPageChange,
    onRowsPerPageChange,
  } = props;
  const [totalConfirm, { data, loading, error }] = useMutation(
    "/api/result/confirm"
  );

  const confirm = (id: number) => {
    if (loading) return;
    totalConfirm({ id });
  };
  useEffect(() => {
    if (data) {
      if (data.ok) {
        if (data.confirm) {
        }
        if (data.message) {
          alert(`${data.message}`);
        }
        mutate();
      }
    }
  }, [data]);
  return (
    <Box sx={{ display: "flex", width: "100%", my: 5 }}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell width={"15%"} align="left">
                <Typography fontSize={"small"} fontWeight={"bold"}>
                  날짜
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontSize={"small"} fontWeight={"bold"}>
                  입출손익
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontSize={"small"} fontWeight={"bold"}>
                  지출 / 건수
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontSize={"small"} fontWeight={"bold"}>
                  입금 / 건수
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontSize={"small"} fontWeight={"bold"}>
                  오차
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontSize={"small"} fontWeight={"bold"}>
                  처리일
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontSize={"small"} fontWeight={"bold"}>
                  잔고총액
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontSize={"small"} fontWeight={"bold"}>
                  상태
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((item) => {
              return (
                <Fragment key={item.id}>
                  <TableRow>
                    <TableCell align="left">
                      <Typography
                        fontSize={"small"}
                        fontWeight={"bold"}
                        color={moment(item.totalAt).day() === 0 ? "error" : ""}
                      >
                        {moment(item.totalAt).format("YYYY-MM-DD (ddd)")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        fontSize={"small"}
                        fontWeight={"bold"}
                        color={item.solutionTotal < 0 ? "error" : ""}
                      >
                        {numeral(item.solutionTotal).format("0,0")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        title={
                          item.withdraw.length > 0 && (
                            <Box width={200}>
                              {item.withdraw.map((v) => {
                                return (
                                  <Box
                                    key={v.id}
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                  >
                                    <Typography fontSize={"small"}>
                                      {v.memo}
                                    </Typography>
                                    <Typography fontSize={"small"}>
                                      {numeral(v.price).format("0,0")}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                          )
                        }
                      >
                        <Box display={"flex"} justifyContent={"center"}>
                          <Typography
                            fontSize={"small"}
                            fontWeight={"bold"}
                            color={"error"}
                          >
                            {numeral(item.withdrawTotal).format("0,0")}
                          </Typography>
                          <Typography
                            fontSize={"small"}
                            fontWeight={"bold"}
                            sx={{ px: 0.5 }}
                          >
                            /
                          </Typography>
                          <Typography fontSize={"small"} fontWeight={"bold"}>
                            {numeral(item.withdrawCount).format("0,0")} 건
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        title={
                          item.deposit.length > 0 && (
                            <Box width={200}>
                              {item.deposit.map((v) => {
                                return (
                                  <Box
                                    key={v.id}
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                  >
                                    <Typography fontSize={"small"}>
                                      {v.memo}
                                    </Typography>
                                    <Typography fontSize={"small"}>
                                      {numeral(v.price).format("0,0")}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                          )
                        }
                      >
                        <Box display={"flex"} justifyContent={"center"}>
                          <Typography fontSize={"small"} fontWeight={"bold"}>
                            {numeral(item.depositTotal).format("0,0")}
                          </Typography>
                          <Typography
                            fontSize={"small"}
                            fontWeight={"bold"}
                            sx={{ px: 0.5 }}
                          >
                            /
                          </Typography>
                          <Typography fontSize={"small"} fontWeight={"bold"}>
                            {numeral(item.depositCount).format("0,0")} 건
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        fontSize={"small"}
                        fontWeight={"bold"}
                        color={item.marginTotla < 0 ? "error" : ""}
                      >
                        {numeral(item.marginTotla).format("0,0")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontSize={"small"} fontWeight={"bold"}>
                        {moment(item.createAt).format("YYYY-MM-DD (ddd)")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        fontSize={"small"}
                        fontWeight={"bold"}
                        color={item.todayTotal < 0 ? "error" : ""}
                      >
                        {numeral(item.todayTotal).format("0,0")}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {item.confirm ? (
                        <Typography fontSize={"small"} fontWeight={"bold"}>
                          정산완료
                        </Typography>
                      ) : (
                        <Box display={"flex"} justifyContent={"end"}>
                          <Link href={`/edit/${item.id}`}>
                            <Button
                              size="small"
                              sx={{ p: 0 }}
                              variant="outlined"
                              color="warning"
                            >
                              <Typography
                                fontSize={"small"}
                                fontWeight={"bold"}
                              >
                                수정
                              </Typography>
                            </Button>{" "}
                          </Link>

                          {level === "1" && (
                            <Button
                              size="small"
                              sx={{ p: 0, ml: 1 }}
                              variant="contained"
                              color="success"
                              onClick={() => {
                                confirm(item.id);
                              }}
                            >
                              <Typography
                                fontSize={"small"}
                                fontWeight={"bold"}
                              >
                                확정
                              </Typography>
                            </Button>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={listCount}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={listCount <= 0 ? 0 : page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 30]}
        />
      </TableContainer>
    </Box>
  );
};
