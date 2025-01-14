import ClientRoom from "./ClientRoom";

export default async function Page({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;
    return <ClientRoom roomId={roomId} />;
}
