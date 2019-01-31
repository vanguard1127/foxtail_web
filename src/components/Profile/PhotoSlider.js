import React, { Component } from 'react';
import OwlCarousel from 'react-owl-carousel';
import _ from 'lodash';
import $ from 'jquery';
import 'lightgallery';
import 'lg-thumbnail';
import 'lg-fullscreen';
import 'lg-zoom';
import 'lg-autoplay';
import { preventContextMenu } from '../../utils/image';

const configLightGallery = {
  thumbnail: true,
  selector: 'a',
  width: '100%',
  thumbnail: true,
  download: false,
  mousewheel: true,
  zoom: true
};

class PhotoSlider extends Component {
  onLightGallery = node => {
    this.lightGallery = node;
    $(node).lightGallery(configLightGallery);
  };

  componentDidMount() {
    document.addEventListener('contextmenu', this.handleContextMenu);
  }

  handleContextMenu = event => {
    if (event.target.hasAttribute('src')) preventContextMenu(event);
  };

  multiIncludes(text, values) {
    var re = new RegExp(values.join('|'));
    return re.test(text);
  }

  componentWillUnmount() {
    try {
      document.removeEventListener('contextmenu', this.handleContextMenu);
      $(this.lightGallery)
        .data('lightGallery')
        .destroy(true);
    } catch (e) {}
  }

  render() {
    const { isPublic, photos, t } = this.props;

    return (
      <div
        className={isPublic ? 'photos-slider public' : 'photos-slider private'}
      >
        <div className="profile-head">
          {isPublic ? t('Public') : t('Private')} {t('Photos')} ({photos.length}
          )
        </div>
        <div id="lightgallery" ref={this.onLightGallery}>
          <OwlCarousel
            className="owl-carousel slider-content"
            autoplay
            margin={30}
            nav
            dots={false}
            navText={[
              '<i class="icon-left-open">',
              '<i class="icon-right-open">'
            ]}
            lazyLoad
            autoplayTimeout={2400}
            autoplayHoverPause={false}
            responsive={{
              0: {
                items: 2,
                margin: 15
              },
              768: {
                items: 3,
                margin: 15
              },
              992: {
                items: 4,
                margin: 15
              },
              1200: {
                items: 6
              }
            }}
          >
            {photos.map(photo => (
              <div
                className="item"
                key={Math.random()}
                onContextMenu={preventContextMenu}
              >
                <a href={photo.url}>
                  <img src={photo.url} alt="" />
                </a>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
    );
  }
}

export default PhotoSlider;
