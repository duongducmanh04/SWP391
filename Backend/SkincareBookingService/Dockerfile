# Use the ASP.NET runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Use the .NET SDK for the build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project files and restore dependencies
COPY ["SkincareBookingService/SkincareBookingService.csproj", "SkincareBookingService/"]
COPY ["SkincareBookingService.BLL/SkincareBookingService.BLL.csproj", "SkincareBookingService.BLL/"]
COPY ["SkincareBookingService.Core/SkincareBookingService.Core.csproj", "SkincareBookingService.Core/"]
COPY ["SkincareBookingService.DAL/SkincareBookingService.DAL.csproj", "SkincareBookingService.DAL/"]
RUN dotnet restore "./SkincareBookingService/SkincareBookingService.csproj"

# Copy the remaining source code and build the application
COPY . .
WORKDIR "/src/SkincareBookingService"
RUN dotnet build "./SkincareBookingService.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SkincareBookingService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage: set up the runtime environment
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SkincareBookingService.dll"]
