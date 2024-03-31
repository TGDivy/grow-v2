import { JournalSessionDocument } from "@server/models/journal.model";
import { Card, Image, Typography } from "antd";
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

type Props = {
  journalSession: JournalSessionDocument | null;
  loading?: boolean;
  sidepanel?: boolean;
};

async function getDownloadUrl(path: string) {
  const storage = getStorage();
  const storageRef = ref(storage, path);

  try {
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Failed to get download URL:", error);
    return "";
  }
}

const SummaryCard = (props: Props) => {
  const { journalSession, loading } = props;

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  useEffect(() => {
    if (journalSession?.image_url) {
      getDownloadUrl(journalSession.image_url).then((url) => {
        setImageUrl(url);
      });
    }
  }, [journalSession]);

  return (
    <>
      <Card
        bordered={false}
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
        loading={loading}
        styles={{
          body: {
            maxWidth: "890px",
            width: "100%",
            // padding: 12,
          },
          cover: {
            width: "100%",
          },
        }}
        cover={
          imageUrl && (
            <Image
              src={imageUrl}
              alt="Journal Session Image"
              loading="lazy"
              style={{
                maxHeight: "300px",
                width: "100%",
                objectFit: "cover",
              }}
            />
          )
        }
      >
        <Card.Meta
          title={
            journalSession?.title || (
              <>
                Journal Session:{" "}
                <Typography.Text type="secondary">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(journalSession?.createdAt || 0))}
                </Typography.Text>
              </>
            )
          }
          description={<Markdown>{journalSession?.summary}</Markdown>}
        />
      </Card>
    </>
  );
};

export default SummaryCard;
