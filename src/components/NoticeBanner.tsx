import type { Notice } from '../store/uiSlice';

interface NoticeBannerProps {
  notice: Notice;
}

export function NoticeBanner({ notice }: NoticeBannerProps) {
  if (!notice) return null;
  return <div className={`alert ${notice.type}`}>{notice.message}</div>;
}
