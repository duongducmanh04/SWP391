# Use the .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything and build the application
COPY . . 
RUN dotnet restore
RUN dotnet publish -c Release -o /out

# Use the ASP.NET runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Run the application
ENTRYPOINT ["dotnet", "SkincareBookingService.dll"]
