import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { VideoClient, VideoService } from '../clients';

const httpRequest = new HttpRequest(axios);
class ApplicationContext {
  public videoService?: VideoService;
  getVideoService(): VideoService {
    if (!this.videoService) {
      this.videoService = new VideoClient('http://localhost:7070/tube', httpRequest, 3, 3, 'AIzaSyCj5-KjcvgnwqGTTn3FcDCfHGkrigTRcm0');
      // this.videoService = new YoutubeClient('AIzaSyCj5-KjcvgnwqGTTn3FcDCfHGkrigTRcm0', httpRequest, 3, 3);
    }
    return this.videoService;
  }
}

export const context = new ApplicationContext();
