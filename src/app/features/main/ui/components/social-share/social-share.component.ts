declare let gtag: Function;
import { Component } from '@angular/core';
import { IconButtonComponent } from '../icons/icon-button/icon-button.component';
import { MainAppService } from '@main/services/main-app-service';
import { SocialShareLink } from '@app/features/main/interfaces/types';
@Component({
  selector: 'app-social-share',
  imports: [IconButtonComponent],
  templateUrl: './social-share.component.html',
  styleUrl: './social-share.component.css',
})
export class SocialShareComponent {
  constructor(private _mainAppService: MainAppService) {}

  public socialShareLinks: SocialShareLink[] = [];

  private getMetaContent(nameOrProperty: string) {
    const metaByProperty = document.querySelector(
      `meta[property="${nameOrProperty}"]`
    );
    const metaByName = document.querySelector(`meta[name="${nameOrProperty}"]`);
    return (
      metaByProperty?.getAttribute('content') ||
      metaByName?.getAttribute('content') ||
      ''
    );
  }

  private getShareTargetUrl() {
    const currentUrl = new URL(window.location.href);
    const isLocalHost =
      currentUrl.hostname === 'localhost' ||
      currentUrl.hostname === '127.0.0.1' ||
      currentUrl.protocol === 'file:';

    if (!isLocalHost) {
      return currentUrl.toString();
    }

    const fallbackPublicUrl =
      this.getMetaContent('og:url') ||
      this.getMetaContent('twitter:url') ||
      'https://teenyquests.ridiculopathy.com/';

    const publicUrl = new URL(fallbackPublicUrl);
    publicUrl.pathname = currentUrl.pathname;
    publicUrl.search = currentUrl.search;
    publicUrl.hash = '';

    return publicUrl.toString();
  }

  getThreadsLink() {
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    const shareText = `${pageTitle} - ${pageUrl}`;
    const encodedText = encodeURIComponent(shareText);
    const threadsIntentUrl = `https://threads.net/intent/post?text=${encodedText}`;
    return threadsIntentUrl;
  }

  ngOnInit() {
    const shareTargetUrl = this.getShareTargetUrl();

    this.socialShareLinks = [
      {
        name: 'Threads',
        url: this.getThreadsLink(),
        icon: 'threads',
      },
      {
        name: 'Reddit',
        url:
          'https://reddit.com/submit?url=' +
          encodeURIComponent(shareTargetUrl) +
          '&title=' +
          encodeURIComponent(document.title),
        icon: 'reddit',
      },
      {
        name: 'Twitter',
        url:
          'https://twitter.com/intent/tweet?url=' +
          encodeURIComponent(shareTargetUrl) +
          '&text=' +
          encodeURIComponent(document.title),
        icon: 'twitter',
      },
      {
        name: 'Facebook',
        url:
          'https://www.facebook.com/sharer/sharer.php?u=' +
          encodeURIComponent(shareTargetUrl),
        icon: 'facebook',
      },
      {
        name: 'Email',
        url:
          'mailto:?subject=' +
          encodeURIComponent(document.title) +
          '&body=' +
          encodeURIComponent(shareTargetUrl),
        icon: 'email',
      },
    ];
    console.log('Social Share Links:', this.socialShareLinks);
  }

  public handleClose() {
    this._mainAppService.setIsSharingOpen(false);
  }

  public handleSocialOutClick(link: SocialShareLink) {
    gtag('event', 'social_share', {
      event_category: 'Engagement',
      event_label: link.name,
      link_url: window.location.href,
      value: 1,
    });

    console.log('Sharing to:', link.name, 'URL:', link.url);
    const popupWindow = window.open(link.url, '_blank');

    if (popupWindow) {
      popupWindow.opener = null;
    }
  }
}
