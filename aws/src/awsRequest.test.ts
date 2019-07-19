import { AwsContext, AwsRequest } from ".";
import awsEvent from "./test/events/defaultAwsEvent.json";

describe("test of request", () => {
  it("should pass-through event values without modifications", () => {
    const sut = new AwsRequest(new AwsContext([awsEvent, null, null]));
    expect(sut.body).toEqual(awsEvent.body);
    expect(sut.headers).toEqual(awsEvent.headers);
    expect(sut.method).toEqual(awsEvent.httpMethod);
    expect(sut.query).toEqual(awsEvent.queryStringParameters);
  });

  it("should use default value for body if not provided", () => {
    const noBodyEvent = Object.assign({}, awsEvent);
    delete noBodyEvent.body;
    const sut = new AwsRequest(new AwsContext([noBodyEvent, null, null]));
    expect(sut.body).toEqual(null);
    expect(sut.headers).toEqual(awsEvent.headers);
    expect(sut.method).toEqual(awsEvent.httpMethod);
    expect(sut.query).toEqual(awsEvent.queryStringParameters);
  });

  it("should use default value for headers if not provided", () => {
    const noHeadersEvent = Object.assign({}, awsEvent);
    delete noHeadersEvent.headers;
    const sut = new AwsRequest(new AwsContext([noHeadersEvent, null, null]));
    expect(sut.body).toEqual(awsEvent.body);
    expect(sut.headers).toEqual({});
    expect(sut.method).toEqual(awsEvent.httpMethod);
    expect(sut.query).toEqual(awsEvent.queryStringParameters);
  });

  it("should use default value for query if not provided", () => {
    const noQueryEvent = Object.assign({}, awsEvent);
    delete noQueryEvent.queryStringParameters;
    const sut = new AwsRequest(new AwsContext([noQueryEvent, null, null]));
    expect(sut.body).toEqual(awsEvent.body);
    expect(sut.headers).toEqual(awsEvent.headers);
    expect(sut.method).toEqual(awsEvent.httpMethod);
    expect(sut.query).toEqual({});
  });

  it("should set context defaults if context content are empty objects", () => {
    const emptyAWSEvent = {
      httpMethod: "GET"
    };

    const sut = new AwsRequest(new AwsContext([emptyAWSEvent, null, null]));

    expect(sut.body).toEqual(null);
    expect(sut.headers).toEqual({});
    expect(sut.method).toEqual("GET");
    expect(sut.query).toEqual({});
  });
});
