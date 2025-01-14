import useWebSocket from "@/app/hooks/useWebSocket";
import { LOBBY_PORT, UserInfo } from "@/app/types";
import parseErrorResponse from "@/app/utils/parseErrorResponse";
import { convertToSearchParams } from "@/app/utils/searchParams";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useCallback, useMemo, useState } from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";
import { Room, SOCKET_EVENT } from "../model/types";
import { fetchGetRooms } from "../service/api";

interface ColumnData {
    dataKey: keyof Room | "button";
    label: string;
    align?: "center" | "left" | "right" | "inherit" | "justify";
    width?: number;
}

const columns: ColumnData[] = [
    { width: 100, label: "Room ID", dataKey: "id", align: "center" },
    { width: 100, label: "Name", dataKey: "name" },
    { width: 70, label: "Host", dataKey: "host" },
    { width: 50, label: "People", dataKey: "numberOfPeople", align: "center" },
    { width: 60, label: "Status", dataKey: "state", align: "center" },
    { width: 100, label: "Enter", dataKey: "button", align: "center" },
    { width: 100, label: "Created Time", dataKey: "createdTime" },
];

const VirtuosoTableComponents: TableComponents<Room> = {
    EmptyPlaceholder: () => (
        <tbody>
            <tr>
                <td className="py-4 text-gray-400 text-center">No Rooms</td>
            </tr>
        </tbody>
    ),
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
        <Table
            {...props}
            sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
        />
    ),
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} />
    )),
    TableRow,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
    )),
};

if (VirtuosoTableComponents.Scroller) {
    VirtuosoTableComponents.Scroller.displayName = "VirtuosoScroller";
}
if (VirtuosoTableComponents.TableHead) {
    VirtuosoTableComponents.TableHead.displayName = "VirtuosoTableHead";
}
if (VirtuosoTableComponents.TableBody) {
    VirtuosoTableComponents.TableBody.displayName = "VirtuosoTableBody";
}

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    align={column.align ?? "left"}
                    style={{
                        width: `${column.width}px`,
                        maxWidth: `${column.width}px`,
                        minWidth: `${column.width}px`,
                    }}
                    sx={{ backgroundColor: "background.paper" }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

const rowContent = (
    _index: number,
    row: Room,
    onEnter: (roomId: string) => void
) => {
    return (
        <React.Fragment>
            {columns.map((column) => (
                <TableCell key={column.dataKey} align={column.align ?? "left"}>
                    {column.dataKey === "button" ? (
                        <Button
                            size="small"
                            variant="outlined"
                            className="text-hide"
                            onClick={() => onEnter(row.id)}
                        >
                            Enter
                        </Button>
                    ) : (
                        <div className="text-hide">{row[column.dataKey]}</div>
                    )}
                </TableCell>
            ))}
        </React.Fragment>
    );
};

interface Props {
    user: UserInfo;
    onEnter: (roomId: string) => void;
}

const RoomTable: React.FC<Props> = ({ user, onEnter }) => {
    const [rooms, setRooms] = useState<Array<Room>>([]);
    const socketParams = useMemo(
        () => convertToSearchParams({ account: user.account }),
        [user]
    );

    const onMessage = useCallback(async (e: MessageEvent) => {
        const msg = JSON.parse(e.data);
        const type: SOCKET_EVENT = msg.type;

        console.log([type], msg);

        const handler = {
            [SOCKET_EVENT.UPDATE_ROOMS]: async () => {
                await fetchGetRooms()
                    .then(({ data: { rooms } }) => setRooms(rooms))
                    .catch(parseErrorResponse());
            },
        } as const;

        await handler[type]();
    }, []);

    const { readyState } = useWebSocket({
        port: LOBBY_PORT,
        params: socketParams,
        onMessage,
    });

    if (readyState !== WebSocket.OPEN) {
        return <></>;
    }
    return (
        <Paper style={{ height: "100%", width: "100%" }}>
            <TableVirtuoso
                data={rooms}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={(_index, row) => rowContent(_index, row, onEnter)}
            />
        </Paper>
    );
};

export default RoomTable;
