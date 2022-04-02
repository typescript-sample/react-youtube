import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { VideoClient, VideoService } from 'video-service';

const httpRequest = new HttpRequest(axios);
class ApplicationContext {
  public videoService?: VideoService;
  getVideoService(): VideoService {
    if (!this.videoService) {
      this.videoService = new VideoClient('http://localhost:7070/tube', httpRequest, 3, 3, 'AIzaSyDVRw8jjqyJWijg57zXSOMpUArlZGpC7bE');
      // this.videoService = new YoutubeClient('AIzaSyDVRw8jjqyJWijg57zXSOMpUArlZGpC7bE', httpRequest, 3, 3);
    }
    return this.videoService;
  }
}

export const context = new ApplicationContext();
