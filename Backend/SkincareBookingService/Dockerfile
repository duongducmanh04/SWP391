# Sử dụng .NET SDK để build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file solution (.sln) và file dự án (.csproj) trước để tối ưu cache
COPY SkincareBookingService.sln .
COPY SkincareBookingService/*.csproj ./SkincareBookingService/
COPY SkincareBookingService.BLL/*.csproj ./SkincareBookingService.BLL/
COPY SkincareBookingService.Core/*.csproj ./SkincareBookingService.Core/
COPY SkincareBookingService.DAL/*.csproj ./SkincareBookingService.DAL/

# Khôi phục package
RUN dotnet restore SkincareBookingService.sln

# Sao chép toàn bộ source code
COPY . .

# Build ứng dụng
RUN dotnet publish SkincareBookingService/SkincareBookingService.csproj -c Release -o /out

# Sử dụng runtime nhẹ hơn cho container chạy ứng dụng
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet", "SkincareBookingService.dll"]
