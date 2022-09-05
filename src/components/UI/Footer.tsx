import styled from 'styled-components';
import ChuvLogo from '../../images/logo_chuv.png';
import { AppConfig } from '../utils';

const FooterBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: #000000cc;
  color: white;
  height: 31px;
  h6 {
    font-size: 14px;
    color: white;
  }

  span {
    display: flex;
  }

  div {
    background: url(${ChuvLogo}) left center no-repeat;
    width: 59px;
    height: 31px;
    margin-right: 16px;
  }
`;

const Footer = ({ appConfig }: { appConfig: AppConfig }): JSX.Element => (
  <FooterBox>
    <div title="CHUV Lausanne"></div>
    <h6>
      © 2015-2022{' '}
      <a
        href="https://www.humanbrainproject.eu/en/"
        title="The Human Brain Project Website"
      >
        Human Brain Project{' '}
      </a>
      . All right reserved
    </h6>
    <h6>{appConfig.version}</h6>
  </FooterBox>
);

export default Footer;
