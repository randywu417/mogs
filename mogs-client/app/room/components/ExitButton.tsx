import { ROUTE } from '@/app/model/routes';
import useLoadingStore from '@/app/store/useLoadingStroe';
import { UserInfo } from '@/app/types';
import parseErrorResponse from '@/app/utils/parseErrorResponse';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import { fetchExitRoom } from '../service/api';

interface Props {
    roomId: string;
    user: UserInfo;
}
const ExitButton: React.FC<Props> = ({ roomId, user }) => {
    const router = useRouter();
    const { loading, setLoading } = useLoadingStore();

    const handleExitRoom = async (): Promise<void> => {
        setLoading(true);

        await fetchExitRoom({ roomId, user })
            .catch(parseErrorResponse())
            .finally(() => router.push(ROUTE.LOBBY));

        setLoading(false);
    };

    return (
        <Button
            fullWidth
            variant="contained"
            size="medium"
            className="h-full"
            disabled={Boolean(loading)}
            onClick={handleExitRoom}>
            Exit Room
        </Button>
    );
};

export default ExitButton;
