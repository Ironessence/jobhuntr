interface FacebookEvent {
  event_name: string;
  event_time: number;
  action_source: string;
  user_data: {
    em?: string[];
    ph?: string[];
    client_user_agent?: string;
    [key: string]: any;
  };
  custom_data?: {
    [key: string]: any;
  };
  event_source_url?: string;
}

interface FacebookEventPayload {
  data: FacebookEvent[];
}

export class FacebookConversionsAPI {
  private pixelId: string;
  private accessToken: string;
  private apiVersion: string = "v18.0"; // Update this as needed

  constructor(pixelId: string, accessToken: string) {
    this.pixelId = pixelId;
    this.accessToken = accessToken;
  }

  private getEndpoint(): string {
    return `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events`;
  }

  async sendEvent(event: FacebookEvent): Promise<Response> {
    const payload: FacebookEventPayload = {
      data: [event],
    };

    const response = await fetch(this.getEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        access_token: this.accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Facebook Conversions API error: ${response.statusText}`);
    }

    return response;
  }

  async trackViewContent(url: string, userAgent: string): Promise<Response> {
    const event: FacebookEvent = {
      event_name: "ViewContent",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: url,
      user_data: {
        client_user_agent: userAgent,
      },
    };

    return this.sendEvent(event);
  }

  async trackInitiateCheckout(url: string, userAgent: string): Promise<Response> {
    const event: FacebookEvent = {
      event_name: "InitiateCheckout",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: url,
      user_data: {
        client_user_agent: userAgent,
      },
    };

    return this.sendEvent(event);
  }
}

// Client-side tracking utility
declare global {
  interface Window {
    fbq: (command: string, event: string, data?: any) => void;
  }
}

export const trackFacebookEvent = (eventName: string, data?: any) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, data);
  }
};
