/**
 * Interface for Lambda Options
 * @interface
 * @property {string} name - lambda name
 * @property {?boolean} protected - is protected, checks for JWT
 */
export interface LambdaOptions {
  name: string;
  protected?: boolean;
}
