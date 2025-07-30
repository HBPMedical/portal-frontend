import styled from 'styled-components';
import ChuvLogo from '../../images/logo_chuv.png';
import HbpLogo from '../../images/hbp-logo.png';
import EbrainsLogo from '../../images/logo.png';
import { AppConfig } from '../utils';

const FooterBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  color: white;
  height: 70px;
  border-top: 1px solid lightgray; //line
  h6 {
    font-size: 14px;
    color: white;
  }

  span {
    display: flex;
  }

  .footer-logos {
    display: flex;
    flex-direction: row;
    gap: 30px;
  }
`;

const Footer = ({ appConfig }: { appConfig: AppConfig }): JSX.Element => (
  <FooterBox>
    <div className="footer-logos">
      <img src={EbrainsLogo} alt="Ebrains Logo" height="30" />
      <img src={ChuvLogo} alt="CHUV Logo" />
    </div>
    <h6>
      © 2015-2025{' '}
      <a
        href="https://www.humanbrainproject.eu/en/"
        title="The Human Brain Project Website"
      >
        Human Brain Project
      </a>
      /
      <a href="https://www.ebrains.eu/" title="EBRAINS Website">
        EBRAINS
      </a>
      . All right reserved
    </h6>
    <h6>{appConfig.version}</h6>
  </FooterBox>
);

export default Footer;
