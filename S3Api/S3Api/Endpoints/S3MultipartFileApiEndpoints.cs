using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using S3Api.Models;
using S3Api.Options;

namespace S3Api.Endpoints
{
    public static class S3MultipartFileApiEndpoints
    {
        public static IEndpointRouteBuilder AddMultipartFileApiEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("multipart");

            group.MapPost("images/start-multipart", async (string fileName, string contentType, IAmazonS3 s3Client, IOptions<S3Config> s3Settings) =>
            {
                var key = Guid.NewGuid();
                var request = new InitiateMultipartUploadRequest
                {
                    BucketName = s3Settings.Value.BucketName,
                    Key = $"images/{key}",
                    ContentType = contentType,
                    Metadata =
                    {
                        ["file-name"] = fileName
                    }
                };

                var response = await s3Client.InitiateMultipartUploadAsync(request);

                return Results.Ok(new { key, uploadId = response.UploadId });
            });

            group.MapPost("images/{key}/presigned-part", (string key, string uploadId, int partNumber, IAmazonS3 s3Client,
                IOptions<S3Config> s3Settings) =>
            {

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = s3Settings.Value.BucketName,
                    Key = $"images/{key}",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(15),
                    UploadId = uploadId,
                    PartNumber = partNumber
                };

                string preSignedUrl = s3Client.GetPreSignedURL(request);

                return Results.Ok(new { key, url = preSignedUrl });

            });

            group.MapPost("images/{key}/complete-multipart", async (string key, CompleteMultipartUpload complete, IAmazonS3 s3Client, IOptions<S3Config> s3Settings) =>
            {
                var request = new CompleteMultipartUploadRequest
                {
                    BucketName = s3Settings.Value.BucketName,
                    Key = $"images/{key}",
                    UploadId = complete.UploadId,
                    PartETags = complete.Parts.Select(p => new PartETag(p.PartNumber, p.ETag)).ToList()
                };

                var response = await s3Client.CompleteMultipartUploadAsync(request);

                return Results.Ok(new { key, location = response.Location });
            });

            return app;
        }
    }
}
