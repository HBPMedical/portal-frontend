import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  usePDF,
  View
} from '@react-pdf/renderer';
import * as hmtlToImage from 'html-to-image';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Experiment } from '../../API/GraphQL/types.generated';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Oswald'
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
});

type Props = {
  experiment?: Experiment;
};

type DocumentPDFHandle = {
  update: () => Promise<void>;
};

const fetchImages = async (): Promise<string[]> => {
  return Promise.all(
    Array.from(document.getElementsByClassName('result')).map(async el => {
      return hmtlToImage.toPng(el as HTMLElement);
    })
  );
};

const DocumentPDF = React.forwardRef<DocumentPDFHandle, Props>(
  ({ experiment }: Props, ref) => {
    const [images, SetImages] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      update: async (): Promise<void> => {
        const imgs = await fetchImages();
        SetImages(imgs);
      }
    }));

    useEffect(() => {
      console.log('updated 2');

      const fetchData = async () => {
        const imgs = await fetchImages();
        SetImages(imgs);
      };
      fetchData();
    }, [experiment]);

    return (
      <Document>
        <Page size="A4">
          {experiment && (
            <View>
              <Text style={styles.title}>{experiment.name}</Text>
              {experiment.author && (
                <Text style={styles.author}>
                  Created by{' '}
                  {experiment.author.fullname ?? experiment?.author?.username}
                </Text>
              )}
            </View>
          )}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
        {images.map((img, i) => (
          <Page size="A4" key={i} orientation="landscape">
            <Image src={img} style={styles.image} />
          </Page>
        ))}
      </Document>
    );
  }
);

const ExperimentPDF = ({ experiment }: Props) => {
  const documentPDF = useRef<DocumentPDFHandle>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [isEnabled, setEnabled] = useState<boolean>(false);

  const [instance, updateInstance] = usePDF({
    document: <DocumentPDF experiment={experiment} ref={documentPDF} />
  });

  useEffect(() => {
    console.log('run', isEnabled, instance);
    if (isEnabled && !instance.loading) {
      console.log('click');

      setEnabled(false);
      linkRef.current?.click();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance.loading]);

  return (
    <>
      <Button
        onClick={() => {
          linkRef.current?.click();
        }}
      >
        testing
      </Button>
      <Button
        onClick={async () => {
          await documentPDF.current?.update();
          updateInstance();
          setEnabled(true);
        }}
      >
        Download
      </Button>
      {!instance.loading && instance.url && (
        <a
          href={instance.url}
          download="test.pdf"
          ref={linkRef}
          className="d-none"
        >
          test
        </a>
      )}
    </>
  );
};

export default ExperimentPDF;
