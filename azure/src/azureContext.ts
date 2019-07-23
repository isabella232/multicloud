import "reflect-metadata";
import { AzureRequest, AzureResponse } from ".";
import { CloudContext, ComponentType } from "@multicloud/sls-core";
import { CloudStorage } from "@multicloud/sls-core";
import { injectable, inject } from "inversify";

/**
 * Implementation of Cloud Context for Azure Functions
 */
@injectable()
export class AzureContext implements CloudContext {
  /**
   * Initializes new AzureContext, injects runtime arguments of Azure Functions
   * @param args Runtime arguments for Azure function
   */
  public constructor(@inject(ComponentType.RuntimeArgs) private args: any[]) {
    this.runtime = args[0];
    this.providerType = "azure";
    this.id = this.runtime.invocationId;

    // Azure Functions (JavaScript) expect developers to use `context.log`,
    // instead of the usual console logging APIs. This effectively redirects
    // console.* logging calls to use the Azure context.* logging equivalents
    // https://github.com/Azure/azure-functions-host/issues/162
    console.log = this.runtime.log;
    console.info = this.runtime.info;
    console.warn = this.runtime.warn;
    console.error = this.runtime.error;
    console.debug = this.runtime.debug;
    console.trace = this.runtime.trace;
  }

  /** "azure" */
  public providerType: string;
  /** Unique identifier for request */
  public id: string;
  /** HTTP Request */
  public req: AzureRequest;
  /** HTTP Response */
  public res: AzureResponse;
  /** Azure Storage Service */
  public storage: CloudStorage;
  /** Original runtime context for Azure Function */
  public runtime: any;
  /** Signals to the runtime that the request is complete */
  public done: () => void;

  /**
   * Send response from Azure Function
   * @param body Body of response
   * @param status Status code of response
   */
  public send(body: any, status: number = 200): void {
    if (this.res) {
      this.res.send(body, status);
    }
    this.runtime.done();
    this.done();
  }
}
