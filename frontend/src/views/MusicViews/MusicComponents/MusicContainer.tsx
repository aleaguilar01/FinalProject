
import { Row, Col, Typography } from 'antd';
import FavouritePlayListRow from './FavouritePlaylistRow';
import ReccomendedPlayListRow from './ReccomendedPlaylistsRow';
import CustomPlayListRow from './CustomPlaylistRow';
import '../MusicStyles/MusicContainer.styles.css'

const { Title } = Typography;


const MusicContainer = () => {
  return (
    <div className="music-container">
      {/* Title for the Favorite Playlists section */}
      <Row>
          <Col span={24}>
            <Title level={2} className='music-container-title'>
              Music
            </Title>
          </Col>
      </Row>

      <FavouritePlayListRow/>
      <ReccomendedPlayListRow/>
      <CustomPlayListRow />
    </div>
  );
};

export default MusicContainer;