/* eslint-disable react-hooks/exhaustive-deps */
import { makeVar, useReactiveVar } from '@apollo/client';
import {
  Document,
  Font,
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
import { domainsVar, variablesVar } from '../../API/GraphQL/cache';
import { useListAlgorithmsQuery } from '../../API/GraphQL/queries.generated';
import { Algorithm, Experiment } from '../../API/GraphQL/types.generated';
import { makeAssetURL } from '../../API/RequestURLS';

Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src:
        'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf'
    },
    {
      src:
        'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf',
      fontWeight: 600
    }
  ]
});

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
  bold: {
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  result: {
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
  },
  smallMargin: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 15,
    marginTop: 100
  },
  title: {
    fontFamily: 'Open Sans',
    fontSize: 26,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  subtitle: {
    fontFamily: 'Open Sans',
    fontSize: 13,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    flexWrap: 'wrap'
  },
  author: {
    fontSize: 12,
    color: '#969696'
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

export type ChildrenPDFExport = {
  downloadPDF: () => void;
  isLoading: boolean;
};

type Props = {
  filename?: string;
  experiment?: Experiment;
  children?: (data: ChildrenPDFExport) => JSX.Element;
};

type DocumentProps = Props & {
  algorithm?: Algorithm;
};

type DocumentPDFHandle = {
  update: () => Promise<void>;
};

const fetchImages = async (): Promise<string[]> => {
  const results = Array.from(document.getElementsByClassName('exp-result'));
  return Promise.all(
    results.map(async elem => {
      const container = document.createElement('div');
      container.setAttribute('style', 'width: 1300px; height: auto;');
      document.body.appendChild(container);
      const hasContainer = elem.getAttribute('data-export') === 'container';
      const el = (!hasContainer ? elem : elem.cloneNode(true)) as HTMLElement;

      if (hasContainer) {
        el.classList.remove('exp-result');
        container.appendChild(el);
      }

      const img = await hmtlToImage.toPng(el, {
        skipFonts: true,
        quality: 1,
        pixelRatio: 2
      });

      if (hasContainer) {
        container.removeChild(el);
        el.remove();
        container.remove();
      }

      return img;
    })
  );
};

const Result = ({ images, logo }: { images: string[]; logo: string }) => (
  <>
    {images.map((img, i) => (
      <Page size="A4" key={i} orientation="landscape">
        <Header logo={logo} />
        <View style={styles.body}>
          <Image src={img} />
        </View>
        <Footer />
      </Page>
    ))}
  </>
);

const Footer = ({ id }: { id?: string }) => (
  <View style={styles.footer}>
    <Text style={{ flex: 1, textAlign: 'left' }}>{id}</Text>
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

const algorithmsVar = makeVar<Algorithm[]>([]);
const DocumentPDF = React.forwardRef<DocumentPDFHandle, DocumentProps>(
  ({ experiment }: DocumentProps, ref) => {
    const [images, SetImages] = useState<string[]>([]);
    const variables = useReactiveVar(variablesVar);
    const algos = useReactiveVar(algorithmsVar);
    const emptyLabel = 'none';
    const domain = useReactiveVar(domainsVar).find(
      d => experiment?.domain === d.id
    );
    const interactions =
      experiment?.formula?.interactions &&
      experiment?.formula?.interactions?.length > 0
        ? experiment?.formula?.interactions
            ?.map(tuple => tuple.join(' ↔ '))
            .join(', ')
        : emptyLabel;
    const logoUrl = makeAssetURL('logo.png');
    const algo = algos.find(a => a.id === experiment?.algorithm.name);

    const transformations = experiment?.formula?.transformations
      ?.map(t => ({
        operation: t.operation,
        variable: variables.find(v => v.id === t.id)
      }))
      .map(t => `${t.operation}: ${t.variable?.label ?? t.variable?.id}`)
      .join(', ');

    const params =
      experiment?.algorithm.parameters?.map(p => {
        const label = algo?.parameters?.find(p2 => p2.name === p.name)?.label;
        return {
          id: p.name,
          label: label ?? p.name,
          value: p.value
        };
      }) ?? [];

    useImperativeHandle(ref, () => ({
      update: async (): Promise<void> => {
        const imgs = await fetchImages();
        SetImages(imgs);
      }
    }));

    return (
      <Document>
        <Page size="A4">
          <Header logo={logoUrl} />
          <View
            style={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              paddingHorizontal: 50,
              paddingBottom: 100,
              height: '100%'
            }}
          >
            {experiment && (
              <>
                <View>
                  <View style={{ ...styles.title, fontSize: 40 }}>
                    <Text>{experiment.name}</Text>
                  </View>
                  {experiment.author && (
                    <View>
                      <Text style={styles.author}>
                        Created by{' '}
                        {experiment?.author?.fullname ??
                          experiment?.author?.username}
                        {' on '}
                        {experiment &&
                          experiment.createdAt &&
                          new Date(experiment.createdAt).toUTCString()}
                        .
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
          <Footer />
        </Page>
        <Page size="A4">
          <Header logo={logoUrl} />
          <View style={styles.body}>
            {experiment && (
              <View>
                <View style={styles.title}>
                  <Text style={{ fontWeight: 'bold' }}>Experiment details</Text>
                </View>
                <View style={{ marginLeft: 5, marginTop: 15 }}>
                  <View style={styles.subtitle}>
                    <Text style={styles.bold}>Algorithm: </Text>
                    <Text>{algo?.label ?? experiment.algorithm.name}</Text>
                  </View>
                  <View style={{ ...styles.subtitle, marginLeft: 10 }}>
                    <Text style={styles.bold}>Params: </Text>
                    <View style={styles.flexCol}>
                      {params.length === 0 && <Text>{emptyLabel}</Text>}
                      {params
                        ?.map(p => `${p.label ?? p.id}: ${p.value}`)
                        .map((text, i) => <Text key={i}>{text}</Text>) ??
                        emptyLabel}
                    </View>
                  </View>
                  <View style={styles.subtitle}>
                    <Text style={styles.bold}>Domain: </Text>
                    <Text>{domain?.label ?? domain?.id}</Text>
                  </View>
                  <View style={styles.subtitle}>
                    <Text style={styles.bold}>Datasets: </Text>
                    <Text>
                      {domain?.datasets
                        .filter(d => experiment.datasets.includes(d.id))
                        .map(d => d.label ?? d.id)
                        .join(', ')}
                    </Text>
                  </View>
                  <View style={styles.subtitle}>
                    <Text style={styles.bold}>Variables: </Text>
                    <Text>
                      {experiment.variables
                        .map(
                          id => variables.find(v => v.id === id)?.label ?? id
                        )
                        .join(', ') ?? emptyLabel}
                    </Text>
                  </View>
                  <View style={styles.subtitle}>
                    <Text style={styles.bold}>Covariates: </Text>
                    <Text>
                      {experiment.coVariables
                        ?.map(
                          id => variables.find(v => v.id === id)?.label ?? id
                        )
                        .join(', ') ?? emptyLabel}
                    </Text>
                  </View>
                  <View style={styles.subtitle}>
                    <Text style={styles.bold}>Filter: </Text>
                    <Text>
                      {!experiment.filter || experiment.filter === ''
                        ? emptyLabel
                        : experiment.filter}
                    </Text>
                  </View>
                  <View style={styles.subtitle}>
                    <Text style={styles.bold}>Formula </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <View style={styles.subtitle}>
                      <Text style={styles.bold}>Interactions: </Text>
                      <Text>{interactions}</Text>
                    </View>
                    <View style={styles.subtitle}>
                      <Text style={styles.bold}>Transformations: </Text>
                      <Text>
                        {transformations && transformations.length > 0
                          ? transformations
                          : emptyLabel}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
          <Footer />
        </Page>
        <Result images={images} logo={logoUrl} />
      </Document>
    );
  }
);

const ExperimentPDF = ({ experiment, children, filename }: Props) => {
  const documentPDF = useRef<DocumentPDFHandle>(null);
  const [isEnabled, setEnabled] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  useListAlgorithmsQuery({
    onCompleted: data => algorithmsVar(data.algorithms)
  });

  const [instance, updateInstance] = usePDF({
    document: <DocumentPDF experiment={experiment} ref={documentPDF} />
  });

  useEffect(() => {
    if (isEnabled && !instance.loading) {
      setEnabled(false);

      const link = document.createElement('a');
      link.href = instance.url ?? '';
      link.download =
        filename ?? `export-${new Date().toJSON().slice(0, 10)}.json`;

      link.click();
      link.remove();
    }
  }, [instance.loading]);

  useEffect(() => {
    updateInstance();
  }, [experiment]);

  useEffect(() => {
    const updateDocument = async () => {
      await documentPDF.current?.update();
      updateInstance();

      setEnabled(true);
      setLoading(false);
    };

    if (isLoading) updateDocument();
  }, [isLoading]);

  const labelBtn = isLoading ? 'Generating...' : 'Download';

  const reloadDocument = () => {
    setLoading(true);
  };

  return children ? (
    children({
      downloadPDF: reloadDocument,
      isLoading
    })
  ) : (
    <>
      <Button variant="info" onClick={reloadDocument} disabled={isLoading}>
        {labelBtn}
      </Button>
    </>
  );
};

export default ExperimentPDF;
