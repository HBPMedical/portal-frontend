import styled from 'styled-components';

const WarningContainer = styled.div`
  h3 {
    margin: 0;
    font-size: 16px;
    color: rgb(240, 173, 78);
  }
`;

const Warning = ({ message }: { message: string }): JSX.Element => (
  <WarningContainer>
    <h3>A problem has occured</h3>
    <p>{message}</p>
  </WarningContainer>
);

export default Warning;
