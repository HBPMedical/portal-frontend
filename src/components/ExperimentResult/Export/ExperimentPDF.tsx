/* eslint-disable react-hooks/exhaustive-deps */
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
import { makeAssetURL } from '../../API/RequestURLS';

const headerStyles = StyleSheet.create({
  container: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    padding: 15,
    paddingLeft: 25,
    paddingRight: 25,
    height: 70,
    top: 0,
    left: 0,
    right: 0
  },
  text: {
    textAlign: 'right',
    flexGrow: 1,
    alignContent: 'center',
    alignSelf: 'center',
    color: '#929292',
    fontSize: 14,
    fontWeight: 'thin'
  },
  logo: {
    height: 'auto',
    width: 40
  }
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    marginTop: 100
  },
  smallMargin: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 15,
    marginTop: 100
  },
  title: {
    fontSize: 24
  },
  author: {
    fontSize: 12,
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

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    fontSize: 12,
    color: 'grey'
  },
  pageNumber: {
    flex: 1,
    textAlign: 'center'
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
      const backupStyle = el.getAttribute('style') ?? '';
      el.setAttribute(
        'style',
        'width: 1000px; height: auto; display: inline-block;'
      );
      const img = await hmtlToImage.toPng(el as HTMLDivElement, {
        skipFonts: true,
        quality: 1,
        pixelRatio: 2,
        style: {
          display: 'inline-block'
        }
      });

      el.setAttribute('style', backupStyle);

      return img;
    })
  );
};

const Footer = () => (
  <View style={styles.footer}>
    <Text style={{ flex: 1, textAlign: 'left' }}></Text>
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      fixed
    />
    <Text style={{ flex: 1, textAlign: 'right' }}>
      {new Date().toLocaleString()}
    </Text>
  </View>
);

const Header = ({ logo }: { logo: string }) => (
  <View style={headerStyles.container} fixed>
    <Image src={logo} style={headerStyles.logo} />
    <Text style={headerStyles.text}>Medical Informatics Platform</Text>
  </View>
);

const DocumentPDF = React.forwardRef<DocumentPDFHandle, Props>(
  ({ experiment }: Props, ref) => {
    const [images, SetImages] = useState<string[]>([]);
    const logoUrl = makeAssetURL('logo.png');

    useImperativeHandle(ref, () => ({
      update: async (): Promise<void> => {
        const imgs = await fetchImages();
        SetImages(imgs);
      }
    }));

    useEffect(() => {
      const fetchData = async () => {
        const imgs = await fetchImages();
        SetImages(imgs);
      };
      fetchData();
    }, [experiment]);

    return (
      <Document>
        <Page size="A4">
          <Header logo={logoUrl} />
          <View style={styles.body}>
            {experiment && (
              <View>
                <Text style={styles.title}>{experiment.name}</Text>
                <Text style={styles.title}>{experiment.name}</Text>
                {experiment.author && (
                  <Text style={styles.author}>
                    Created by{' '}
                    {experiment.author.fullname ?? experiment?.author?.username}
                  </Text>
                )}
              </View>
            )}
          </View>
          <Footer />
        </Page>
        {images.map((img, i) => (
          <Page size="A4" key={i} orientation="landscape">
            <Header logo={logoUrl} />
            <View style={styles.body}>
              <Image src={img} />
            </View>
            <Footer />
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
  const [isLoading, setLoading] = useState<boolean>(false);

  const [instance, updateInstance] = usePDF({
    document: <DocumentPDF experiment={experiment} ref={documentPDF} />
  });

  useEffect(() => {
    if (isEnabled && !instance.loading) {
      setEnabled(false);

      linkRef.current?.click();
    }
  }, [instance.loading]);

  useEffect(() => {
    const updateDocument = async () => {
      await documentPDF.current?.update();
      updateInstance();

      setEnabled(true);
      setLoading(false);
    };

    if (isLoading) updateDocument();
  }, [isLoading]);

  return (
    <>
      <Button
        onClick={() => {
          setLoading(true);
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Download'}
      </Button>
      {!instance.loading && instance.url && (
        <a
          href={instance.url}
          download={`export-${new Date().toJSON().slice(0, 10)}.pdf`}
          ref={linkRef}
          className="d-none"
        >
          link
        </a>
      )}
    </>
  );
};

export default ExperimentPDF;
