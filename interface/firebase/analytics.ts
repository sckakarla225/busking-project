import { analytics } from "./firebaseConfig";
import { logEvent, setUserId } from 'firebase/analytics';

// Conversion flow

const logUserLoggedIn = (): void => {
  if (analytics) {
    logEvent(analytics, 'login');
  }
};

const logViewRegisterPage = (): void => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_path: '/register'
    });
  }
};

const logViewMapPage = (): void => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_path: '/'
    });
  }
};

// Usage per user

const logSpotClicked = (userId: string, spotId: string): void => {
  if (analytics) {
    setUserId(analytics, userId);
    logEvent(analytics, 'select_content', {
      'content_type': 'spot-clicked',
      'item_id': spotId,
    });
  }
};

const logSpotViewed = (userId: string, spotId: string): void => {
  if (analytics) {
    setUserId(analytics, userId);
    logEvent(analytics, 'select_content', {
      'content_type': 'spot-viewed',
      'item_id': spotId
    });
  }
};

const logTimeViewed = (userId: string, timeString: string): void => {
  if (analytics) {
    setUserId(analytics, userId);
    logEvent(analytics, 'select_content', {
      'content_type': 'time-viewed',
      'item_id': timeString
    });
  }
};

// UI metrics

const logKeyClicked = (): void => {
  if (analytics) {
    logEvent(analytics, 'select_content', {
      'content_type': 'key-clicked'
    });
  }
};

const logProfileViewed = (): void => {
  if (analytics) {
    logEvent(analytics, 'select_content', {
      'content_type': 'profile-viewed'
    });
  }
};

const logSpotReserved = (spotId: string): void => {
  if (analytics) {
    logEvent(analytics, 'select_content', {
      'content_type': 'spot-reserved',
      'item_id': spotId
    });
  }
};

const logSpotLeft = (spotId: string): void => {
  if (analytics) {
    logEvent(analytics, 'select_content', {
      'content_type': 'spot-left',
      'item_id': spotId
    });
  }
};

export {
  logUserLoggedIn, 
  logViewRegisterPage,
  logViewMapPage,
  logSpotClicked,
  logSpotViewed,
  logTimeViewed,
  logKeyClicked,
  logProfileViewed,
  logSpotReserved,
  logSpotLeft
};