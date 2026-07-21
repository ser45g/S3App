using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using S3Api.Options;

namespace S3Api.Endpoints
{
    public static class S3FileApiEndpoints
    {
        public static IEndpointRouteBuilder AddS3FileEndpoints(this IEndpointRouteBuilder app) {

            var group = app.MapGroup("/file");

            group.MapDelete("images/{key}", async (string key, IAmazonS3 s3Client, IOptions<S3Config> s3Settings) =>
            {
                var getRequest = new DeleteObjectRequest
                {
                    BucketName = s3Settings.Value.BucketName,
                    Key = $"images/{key}"
                };

                await s3Client.DeleteObjectAsync(getRequest);

                return Results.Ok($"File {key} deleted successfully");
            });

            group.MapGet("images/{key}/presigned", (string key, IAmazonS3 s3Client, IOptions<S3Config> s3Settings) =>
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = s3Settings.Value.BucketName,
                    Key = $"images/{key}",
                    Verb = HttpVerb.GET,
                    Expires = DateTime.UtcNow.AddMinutes(15)
                };

                string preSignedUrl = s3Client.GetPreSignedURL(request);

                return Results.Ok(new { key, url = preSignedUrl });
            });

            group.MapPost("images/presigned", (string fileName, string contentType, IAmazonS3 s3Client, IOptions<S3Config> s3Settings) =>
            {
                var key = Guid.NewGuid();
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = s3Settings.Value.BucketName,
                    Key = $"images/{key}",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(15),
                    ContentType = contentType,
                    Metadata = {
                        ["file-name"] = fileName,

                    }
                };

                string preSignedUrl = s3Client.GetPreSignedURL(request);

                return Results.Ok(new { key, url = preSignedUrl });
            });


            return app;
        }
    }
}
