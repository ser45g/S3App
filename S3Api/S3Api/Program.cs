using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using S3Api;
using S3Api.Endpoints;
using S3Api.Options;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddOptions<S3Config>().Bind(builder.Configuration.GetSection("S3Config")).ValidateDataAnnotations().ValidateOnStart();

var s3Config = builder.Configuration.GetSection("S3Config").Get<S3Config>();
ArgumentNullException.ThrowIfNull(s3Config, nameof(s3Config));

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(s3Config.Region),
        ServiceURL = s3Config.ServiceUrl,
    };

    var credentials = new BasicAWSCredentials(s3Config.KeyId, s3Config.SecretKey);

    return new AmazonS3Client(credentials, config);
});

var app = builder.Build();

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseExceptionHandler();

app.AddS3FileEndpoints();

app.AddMultipartFileApiEndpoints();

app.Run();
