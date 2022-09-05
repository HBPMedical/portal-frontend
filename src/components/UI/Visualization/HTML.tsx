/* eslint-disable @typescript-eslint/no-explicit-any */
const HTML = ({ doc }: { doc: any }): JSX.Element => (
  <iframe
    title="HTML results"
    className="html-iframe"
    srcDoc={doc}
    width={500}
    height={500}
    allowFullScreen={true}
    frameBorder={0}
  />
);

export default HTML;
