/**
 * Interface for FB auth response with user data
 * @interface
 * @property {string} id
 * @property {string} name
 * @property {object} picture To get picture url -> picture.data.url
 */
export interface FBAuthResponse {
  id: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}
