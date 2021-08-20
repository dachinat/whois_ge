class Api::DomainsController < Api::ApplicationController
  def check_multi
    whois = Whois::Client.new

    @list = domain_params[:list]

    @response = {}
    @list.each do |domain|
      next unless domain.present?

      begin
        record = whois.lookup(domain)
      rescue => e
        next
      end

      available = record.to_s.include? "No match for"

      unless available
        split = record.to_s.split("\r\n\r\n\r\n")
        details = split[0]
        details.strip!.gsub!(/\r\n\s+/,"<br/>")
      end

      @response[domain] = {
        domain: domain,
        available: available,
        details: details || nil
      }
    end

    render json: @response
  end

  def domain_params
    params.require(:domain).permit(list: [])
  end
end