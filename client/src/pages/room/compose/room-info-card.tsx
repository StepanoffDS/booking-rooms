import type { RoomDetails } from '@/entities/room';
import { DisplayIcon } from '@/shared/assets/icons/display';
import { PeopleIcon } from '@/shared/assets/icons/people';
import { VideoIcon } from '@/shared/assets/icons/video';
import { WhiteboardIcon } from '@/shared/assets/icons/whiteboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

const featureIcons = { display: DisplayIcon, video: VideoIcon, whiteboard: WhiteboardIcon };

const getAmenities = (room?: RoomDetails) =>
  room
    ? [
        { Icon: PeopleIcon, title: `Вместимость: до ${room.capacity} человек` },
        ...room.features.map(({ code, name }) => ({
          Icon: featureIcons[code as keyof typeof featureIcons] ?? DisplayIcon,
          title: name,
        })),
      ]
    : [];

export function RoomInfoCard({ room }: { room?: RoomDetails }) {
  return (
    <Card className="h-fit rounded-xl p-6 shadow-none gap-0">
      <CardHeader className="border-b border-border p-0 !pb-5">
        <CardTitle className="text-3xl font-bold">{room?.name ?? 'Переговорная'}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          {room ? `${room.office.name} · ${room.office.address}` : 'Данные переговорной недоступны'}
        </p>
      </CardHeader>
      <CardContent className="p-0 pt-5">
        <dl className="space-y-4">
          {getAmenities(room).map(({ Icon, title }) => (
            <div key={title} className="flex items-center gap-3 text-sm">
              <Icon aria-hidden="true" className="size-5 text-primary" strokeWidth={2} />
              <dd>{title}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
